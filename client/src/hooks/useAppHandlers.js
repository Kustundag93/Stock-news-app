export default function useAppHandlers({
  setOpenTooltip,
  setAnchorEls,
  setTypedText,
  setCardWidths,
  cardRefs,
  priceImpactRefs
}) {
  const handleClose = () => {
    setOpenTooltip(null);
    setAnchorEls({});
    setTypedText({});
  };

  const handleMouseEnter = (key) => {
    setOpenTooltip(key);
  };

  const handleMouseLeave = () => {
    setOpenTooltip(null);
  };

  const handleClick = (key) => {
    const cardWidth = cardRefs.current[key]?.offsetWidth;
    if (cardWidth) {
      setCardWidths(prev => ({ ...prev, [key]: cardWidth }));
    }
    setAnchorEls(prev => ({ ...prev, [key]: priceImpactRefs.current[key] }));
    setOpenTooltip(key);
  };

  return {
    handleClose,
    handleMouseEnter,
    handleMouseLeave,
    handleClick
  };
} 