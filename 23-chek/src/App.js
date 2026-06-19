import React, { useState, useEffect } from 'react';

function App() {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('перевод появится здесь');
  const [loading, setLoading] = useState(false);

  const encodedKey = 'ZGljdC4xLjEuMjAyNjAxMjBUMTQxMjE5Wi45NjM4MDEwMzFjMDI2Njg3Ljg5Y2RjZTA2OTYyZmQ1ZDk0YjkzNzBhZTJiZTk5ZDk3YzNhMTBlNDM=';
  const API_KEY = atob(encodedKey);

  const translateWord = async (russianWord) => {
    const trimmed = russianWord.trim();
    if (!trimmed) {
      setTranslation('перевод появится здесь');
      return;
    }

    setLoading(true);
    setTranslation('Перевожу...');

    try {
      const url = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=ru-en&text=${encodeURIComponent(trimmed)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.def && data.def.length > 0) {
        setTranslation(data.def[0].tr[0].text.toLowerCase());
      } else {
        setTranslation('Перевод не найден');
      }
    } catch (error) {
      setTranslation('Ошибка перевода');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (word) translateWord(word);
    }, 500);
    return () => clearTimeout(timer);
  }, [word]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Введите русское слово"
        style={{ padding: '10px', fontSize: '18px', width: '300px' }}
      />
      <h1>{translation}</h1>
      {loading && <p>Загрузка...</p>}
    </div>
  );
}

export default App;