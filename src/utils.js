export const getRGBAColor = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a})`;

export const getContrast = ({r, g, b}) => {
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  return yiq >= 128 ? 'rgb(0,0,0)' : 'rgb(255, 255, 255)'
}