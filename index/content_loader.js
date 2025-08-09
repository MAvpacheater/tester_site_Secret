// Завантажувач HTML контенту
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
});

async function loadContent() {
    try {
        // Правильний шлях до файлу
        const response = await fetch('index/content.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById('app-content').innerHTML = html;
        
        console.log('✅ Контент завантажено успішно');
        
        // Невелика затримка для повного завантаження DOM
        setTimeout(() => {
            if (typeof initializeApp === 'function') {
                initializeApp();
            } else {
                console.error('❌ Функція initializeApp не знайдена');
            }
        }, 50);
        
    } catch (error) {
        console.error('❌ Помилка завантаження контенту:', error);
        // Fallback - показуємо повідомлення про помилку
        document.getElementById('app-content').innerHTML = `
            <div style="text-align: center; padding: 50px; color: red;">
                <h2>Помилка завантаження</h2>
                <p>Не вдалося завантажити контент додатка.</p>
                <p>Помилка: ${error.message}</p>
            </div>
        `;
    }
}
