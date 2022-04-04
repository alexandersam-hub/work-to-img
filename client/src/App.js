import React, {useState, useRef, useCallback} from 'react';
import axios from 'axios';

export const UPLOAD_AVATAR = 'http://localhost:8080/api/upload_avatar';

function App() {
  // определим изменяемый ref для объекта FileReader
  const fileRef = useRef(null);
  const [ loading, setLoading ] = useState(false);

  const handleSubmit = useCallback( event => {
    event.preventDefault();

    const fetchData = async (uint8Array) => {
      try {
        const response = await axios({
          method: 'post',
          url: UPLOAD_AVATAR,
          data: [...uint8Array] // не отправляем в JSON, размер изображения увеличится
        });

        setLoading(false);
        console.log(response);
      } catch (e) {
        console.error(e.message, 'function handleSubmit')
      }
    };

    if(!fileRef.current) return void null;

    const reader = new FileReader();
    reader.onloadend = () => {
      const uint8Array = new Uint8Array(reader.result);
      setLoading(true);
      fetchData(uint8Array);
    };


    // рекомендованный метод
    reader.readAsArrayBuffer(fileRef.current[0]);

    // метод reader.readAsBinaryString(fileRef.current[0]) 
    // согласно MDN,
    // уже был однажды удален из File API specification, 
    // но после его вернули
    // в использование, но все же рекомендуют 
    // использовать readAsArrayBuffer
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString
  }, []);

  const nodeDom = (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          onChange={e => fileRef.current = e.target.files}
          accept="image/*"
          type="file"
          id="button-file"
        />
      </div>
      <button type="submit">{loading ? 'Сохраняю...' : 'Сохранить'}</button>
    </form>
  );

  return nodeDom
}

export default App;
