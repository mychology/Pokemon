// GlobalStyle.jsx
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@300;400;600&display=swap');

  html, body, #root {
    height: 100%;
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f3f7fb;
  }

  * { box-sizing: border-box; }

  /* utility */
  .center { display:flex; align-items:center; justify-content:center; }
`;
export default GlobalStyle;
