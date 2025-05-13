import { useEffect, useRef } from 'react';

function useTypewriterEffect(openTooltip, aiScores, anchorEls, setTypedText) {
  const typingIntervals = useRef({});

  useEffect(() => {
    if (
      openTooltip &&
      anchorEls[openTooltip]
    ) {
      let fullText = 'Loading summary...';
      let isLoading = true;
      if (aiScores[openTooltip]?.interpretation) {
        fullText = aiScores[openTooltip].interpretation;
        isLoading = false;
      }
      // Sadece açık olan kartın response'u değiştiğinde animasyon başlat
      if (setTypedText[openTooltip] === fullText) return;

      setTypedText(prev => ({ ...prev, [openTooltip]: '' }));
      let i = 0;
      if (typingIntervals.current[openTooltip]) {
        clearInterval(typingIntervals.current[openTooltip]);
      }
      typingIntervals.current[openTooltip] = setInterval(() => {
        setTypedText(prev => ({ ...prev, [openTooltip]: fullText.slice(0, i + 1) }));
        i++;
        if (i >= fullText.length) {
          clearInterval(typingIntervals.current[openTooltip]);
          // Eğer loading bitti ve summary geldiyse, loading'den summary'ye geçiş için tekrar başlat
          if (isLoading && aiScores[openTooltip]?.interpretation) {
            setTypedText(prev => ({ ...prev, [openTooltip]: '' }));
          }
        }
      }, 18);
    }
    return () => {
      if (openTooltip && typingIntervals.current[openTooltip]) {
        clearInterval(typingIntervals.current[openTooltip]);
      }
    };
  }, [openTooltip, aiScores[openTooltip]?.interpretation, anchorEls, setTypedText]);
}

export default useTypewriterEffect; 