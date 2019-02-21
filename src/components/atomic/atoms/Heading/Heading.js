import styled from '../../../../../lib/react-styler';

const H1 = styled.h1`
  font-family: sans-serif;
  margin: 0;
  font-size: 42px;  
`;

const H2 = styled.h2`
  font-family: sans-serif;
  margin: 0;
  font-size: 30px;  
`;

const H3 = styled.h3`
  font-family: sans-serif;
  margin: 0;
  font-size: 22px;  
`;

export default ({ tag, children }) => {
  return (
    {tag === 'h1' && <H1>{children}</H1>}
    {tag === 'h2' && <H2>{children}</H2>}
    {tag === 'h3' && <H3>{children}</H3>}
  );
};
