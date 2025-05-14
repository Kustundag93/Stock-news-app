import { useEffect, useRef } from 'react';

function useTypewriterEffect(text, loading, setTypedText) {
  const typingInterval = useRef();

  useEffect(() => {
    if (loading || !text) {
      setTypedText('');
      return;
    }
    let i = 0;
    setTypedText('');
    if (typingInterval.current) clearInterval(typingInterval.current);
    typingInterval.current = setInterval(() => {
      setTypedText(prev => text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(typingInterval.current);
      }
    }, 14);
    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
    };
    // eslint-disable-next-line
  }, [text, loading]);
}

export default useTypewriterEffect; 