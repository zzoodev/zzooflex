import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  background-color: #ff4363;
  color: #333;
`;
const Column = styled.div`
  display: flex;
`;
const Logo = styled.svg`
  margin-right: 50px;
`;
const Menu = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
  color: white;
`;

function Header() {
  return (
    <Nav>
      <Column>
        <Logo />
        <Menu>
          <Item>menu1</Item>
          <Item>menu2</Item>
          <Item>menu3</Item>
        </Menu>
      </Column>
      <Column></Column>
    </Nav>
  );
}

export default Header;
