#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import hashlib
import uuid
import re
from datetime import datetime
from pathlib import Path

class UserRegistrationSystem:
    def __init__(self, users_directory="users"):
        """Ініціалізація системи реєстрації користувачів"""
        self.users_directory = Path(users_directory)
        self.users_directory.mkdir(exist_ok=True)
        self.users_index_file = self.users_directory / "users_index.json"
        self._load_users_index()
    
    def _load_users_index(self):
        """Завантаження індексу користувачів"""
        if self.users_index_file.exists():
            try:
                with open(self.users_index_file, 'r', encoding='utf-8') as f:
                    self.users_index = json.load(f)
            except Exception as e:
                print(f"Помилка завантаження індексу: {e}")
                self.users_index = {}
        else:
            self.users_index = {}
    
    def _save_users_index(self):
        """Збереження індексу користувачів"""
        try:
            with open(self.users_index_file, 'w', encoding='utf-8') as f:
                json.dump(self.users_index, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"Помилка збереження індексу: {e}")
            return False
    
    def _hash_password(self, password):
        """Хешування пароля"""
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
    
    def _generate_user_id(self):
        """Генерація унікального ID користувача"""
        while True:
            user_id = str(uuid.uuid4()).replace('-', '')[:12]
            if user_id not in self.users_index:
                return user_id
    
    def _validate_email(self, email):
        """Валідація email адреси"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def _validate_phone(self, phone):
        """Валідація номера телефону"""
        # Видаляємо всі символи окрім цифр і знака +
        clean_phone = re.sub(r'[^\d+]', '', phone)
        # Перевіряємо формат (мінімум 10 цифр)
        pattern = r'^\+?[\d]{10,15}$'
        return re.match(pattern, clean_phone) is not None
    
    def _email_exists(self, email):
        """Перевірка чи існує email"""
        return any(user_data.get('email') == email for user_data in self.users_index.values())
    
    def _phone_exists(self, phone):
        """Перевірка чи існує номер телефону"""
        return any(user_data.get('phone') == phone for user_data in self.users_index.values())
    
    def _nickname_exists(self, nickname):
        """Перевірка чи існує нікнейм"""
        return any(user_data.get('nickname') == nickname for user_data in self.users_index.values())
    
    def _create_user_js_file(self, user_data):
        """Створення JS файлу для користувача"""
        user_id = user_data['user_id']
        js_content = f"""// User data for {user_data['nickname']} (ID: {user_id})
// Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

const userData = {{
    userId: '{user_id}',
    email: '{user_data['email']}',
    phone: '{user_data['phone']}',
    nickname: '{user_data['nickname']}',
    registrationDate: '{user_data['registration_date']}',
    isActive: true,
    
    // User preferences (can be modified)
    preferences: {{
        theme: 'default',
        language: 'uk',
        notifications: true,
        autoSave: true
    }},
    
    // User stats and progress
    stats: {{
        calculationsPerformed: 0,
        lastLogin: null,
        totalSessions: 0,
        favoriteCalculator: null
    }},
    
    // Calculator settings
    calculatorSettings: {{
        defaultModifiers: {{
            // Pet Calculator
            petCalculator: {{
                shinyChance: false,
                goldenChance: false,
                rainbowChance: false
            }},
            
            // Arm Calculator  
            armCalculator: {{
                goldenLevel: 5 // 1-5, default max golden
            }},
            
            // Grind Calculator
            grindCalculator: {{
                tp: 1, // 1, 2, or 3
                chocolateDonut: true,
                enchCookie: true,
                time: true,
                friend: true,
                member: true,
                premium: true
            }}
        }}
    }}
}};

// Utility functions for user data management
const userUtils = {{
    // Update user stats
    updateStats: function(statName, value) {{
        if (userData.stats.hasOwnProperty(statName)) {{
            userData.stats[statName] = value;
            this.saveUserData();
        }}
    }},
    
    // Update preferences
    updatePreference: function(prefName, value) {{
        if (userData.preferences.hasOwnProperty(prefName)) {{
            userData.preferences[prefName] = value;
            this.saveUserData();
        }}
    }},
    
    // Update calculator settings
    updateCalculatorSettings: function(calculator, settings) {{
        if (userData.calculatorSettings.defaultModifiers[calculator]) {{
            Object.assign(userData.calculatorSettings.defaultModifiers[calculator], settings);
            this.saveUserData();
        }}
    }},
    
    // Save user data (placeholder - would need server implementation)
    saveUserData: function() {{
        console.log('User data updated:', userData);
        // В реальному застосунку тут був би AJAX запит до сервера
        localStorage.setItem('armHelper_userData', JSON.stringify(userData));
    }},
    
    // Load user data from localStorage as backup
    loadUserData: function() {{
        const saved = localStorage.getItem('armHelper_userData');
        if (saved) {{
            try {{
                const savedData = JSON.parse(saved);
                // Merge saved data with current data, keeping structure
                Object.assign(userData.stats, savedData.stats || {{}});
                Object.assign(userData.preferences, savedData.preferences || {{}});
                Object.assign(userData.calculatorSettings, savedData.calculatorSettings || {{}});
            }} catch (e) {{
                console.warn('Failed to load saved user data:', e);
            }}
        }}
    }},
    
    // Get user info
    getUserInfo: function() {{
        return {{
            id: userData.userId,
            nickname: userData.nickname,
            email: userData.email,
            registrationDate: userData.registrationDate,
            isActive: userData.isActive
        }};
    }}
}};

// Auto-load saved data on script load
userUtils.loadUserData();

// Make userData globally available
if (typeof window !== 'undefined') {{
    window.userData = userData;
    window.userUtils = userUtils;
}}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{ userData, userUtils }};
}}
"""
        
        user_file_path = self.users_directory / f"{user_id}.js"
        try:
            with open(user_file_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            return True
        except Exception as e:
            print(f"Помилка створення JS файлу: {e}")
            return False
    
    def register_user(self, email, phone, password, nickname):
        """Реєстрація нового користувача"""
        # Валідація даних
        if not email or not phone or not password or not nickname:
            return {"success": False, "error": "Всі поля обов'язкові для заповнення"}
        
        if not self._validate_email(email):
            return {"success": False, "error": "Невірний формат email адреси"}
        
        if not self._validate_phone(phone):
            return {"success": False, "error": "Невірний формат номера телефону"}
        
        if len(password) < 6:
            return {"success": False, "error": "Пароль повинен містити мінімум 6 символів"}
        
        if len(nickname) < 3:
            return {"success": False, "error": "Нікнейм повинен містити мінімум 3 символи"}
        
        # Перевірка унікальності
        if self._email_exists(email):
            return {"success": False, "error": "Користувач з таким email вже існує"}
        
        if self._phone_exists(phone):
            return {"success": False, "error": "Користувач з таким номером телефону вже існує"}
        
        if self._nickname_exists(nickname):
            return {"success": False, "error": "Користувач з таким нікнеймом вже існує"}
        
        # Створення користувача
        user_id = self._generate_user_id()
        hashed_password = self._hash_password(password)
        registration_date = datetime.now().isoformat()
        
        user_data = {
            "user_id": user_id,
            "email": email,
            "phone": phone,
            "nickname": nickname,
            "password_hash": hashed_password,
            "registration_date": registration_date,
            "is_active": True,
            "last_login": None
        }
        
        # Додаємо в індекс
        self.users_index[user_id] = user_data
        
        # Зберігаємо індекс
        if not self._save_users_index():
            return {"success": False, "error": "Помилка збереження даних користувача"}
        
        # Створюємо JS файл
        if not self._create_user_js_file(user_data):
            return {"success": False, "error": "Помилка створення файлу користувача"}
        
        return {
            "success": True, 
            "message": "Користувач успішно зареєстрований",
            "user_id": user_id,
            "nickname": nickname
        }
    
    def authenticate_user(self, login, password):
        """Аутентифікація користувача (по email або номеру телефону)"""
        hashed_password = self._hash_password(password)
        
        for user_id, user_data in self.users_index.items():
            if (user_data['email'] == login or user_data['phone'] == login) and \
               user_data['password_hash'] == hashed_password and user_data['is_active']:
                
                # Оновлюємо час останнього входу
                user_data['last_login'] = datetime.now().isoformat()
                self._save_users_index()
                
                return {
                    "success": True,
                    "user_id": user_id,
                    "nickname": user_data['nickname'],
                    "email": user_data['email']
                }
        
        return {"success": False, "error": "Невірний логін або пароль"}
    
    def get_user_stats(self):
        """Статистика користувачів"""
        total_users = len(self.users_index)
        active_users = sum(1 for user in self.users_index.values() if user['is_active'])
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "users_directory": str(self.users_directory)
        }

# Функція для демонстрації роботи системи
def demo_registration():
    """Демонстрація роботи системи реєстрації"""
    system = UserRegistrationSystem()
    
    print("=== Демо системи реєстрації ===")
    print(f"Директорія користувачів: {system.users_directory}")
    print()
    
    # Тестові дані
    test_users = [
        {
            "email": "user1@example.com",
            "phone": "+380501234567",
            "password": "password123",
            "nickname": "TestUser1"
        },
        {
            "email": "user2@example.com", 
            "phone": "+380671234567",
            "password": "password456",
            "nickname": "TestUser2"
        }
    ]
    
    # Реєстрація тестових користувачів
    for i, user_data in enumerate(test_users, 1):
        print(f"Реєстрація користувача {i}:")
        result = system.register_user(**user_data)
        print(f"Результат: {result}")
        print()
    
    # Тест аутентифікації
    print("Тест аутентифікації:")
    auth_result = system.authenticate_user("user1@example.com", "password123")
    print(f"Результат входу: {auth_result}")
    print()
    
    # Статистика
    stats = system.get_user_stats()
    print(f"Статистика: {stats}")

if __name__ == "__main__":
    demo_registration()
