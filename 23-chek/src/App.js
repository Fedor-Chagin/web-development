import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('перевод появится здесь');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  
  // Встроенный словарь на случай, если API не работает
  const dictionary = {
    'привет': 'hello',
    'мир': 'world',
    'дом': 'house',
    'книга': 'book',
    'стол': 'table',
    'машина': 'car',
    'город': 'city',
    'собака': 'dog',
    'кошка': 'cat',
    'вода': 'water'
  };

  const translateWord = async (russianWord) => {
    const trimmed = russianWord.trim();
    
    if (!trimmed) {
      setTranslation('перевод появится здесь');
      return;
    }
    
    // Проверка на русские символы
    if (!/^[а-яА-ЯёЁ\s-]+$/.test(trimmed)) {
      setTranslation('Введите слово на русском языке');
      return;
    }
    
    setLoading(true);
    setTranslation('Перевожу...');
    
    try {
      // API ключ закодирован в base64
      const encodedKey = 'ZGljdC4xLjEuMjAyNjAxMjBUMTQxMjE5Wi45NjM4MDEwMzFjMDI2Njg3Ljg5Y2RjZTA2OTYyZmQ1ZDk0YjkzNzBhZTJiZTk5ZDk3YzNhMTBlNDM=';
      const API_KEY = atob(encodedKey);
      
      const url = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=ru-en&text=${encodeURIComponent(trimmed)}`;
      
      // Пробуем прямой запрос
      let response = await fetch(url);
      
      if (!response.ok) {
        // Через прокси
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        response = await fetch(proxyUrl);
      }
      
      const data = await response.json();
      
      if (data.def && data.def.length > 0) {
        const result = data.def[0].tr[0].text || 'Перевод не найден';
        setTranslation(result.toLowerCase());
      } else {
        // Если API не дал результат - используем словарь
        const dictResult = dictionary[trimmed.toLowerCase()];
        if (dictResult) {
          setTranslation(dictResult);
        } else {
          setTranslation('Перевод не найден');
        }
      }
    } catch (error) {
      // Если ошибка - используем встроенный словарь
      const dictResult = dictionary[trimmed.toLowerCase()];
      if (dictResult) {
        setTranslation(dictResult);
      } else {
        setTranslation('Ошибка перевода');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setWord(value);
    
    // Очищаем предыдущий таймер
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Устанавливаем новый таймер
    timerRef.current = setTimeout(() => {
      translateWord(value);
    }, 500);
  };

  useEffect(() => {
    // Фокус на поле ввода при загрузке
    document.getElementById('wordInput')?.focus();
    
    // Очищаем таймер при размонтировании
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="container">
      <input
        id="wordInput"
        type="text"
        className="input-field"
        placeholder="Введите русское слово"
        value={word}
        onChange={handleInputChange}
      />
      <h1 className="translation">{translation}</h1>
      {loading && <div className="loading">Загрузка...</div>}
    </div>
  );
}

export default App;