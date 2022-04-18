import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  height: 60px;
  width: 100%;
  background-color: #333;
  color: white;
  font-size: 14px;
  padding: 0px 80px;
`;
const Column = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 100px;
  height: 35px;
  margin-right: 50px;
  color: ${(props) => props.theme.white.darker};
  position: relative;
`;
const Items = styled.ul`
  display: flex;
`;
const Item = styled.li`
  position: relative;
  margin-right: 25px;
`;
const Circle = styled(motion.span)`
  position: absolute;
  bottom: -10px;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  width: 5px;
  height: 5px;
  background-color: red;
  border-radius: 50%;
`;
const Search = styled.form`
  display: flex;
  align-items: center;
  position: relative;
`;
const SearchBtn = styled(motion.svg)`
  width: 18px;
  height: 18px;
  color: #fff;
`;
const Input = styled(motion.input)`
  position: absolute;
  transform-origin: right center;
  right: 20px;
  width: 250px;
  height: 30px;
  outline: none;
  background-color: ${(prop) => prop.theme.black.lighter};
  padding-left: 35px;
  border: 0.5px solid #d9d9d9;
  color: white;
`;

const logoVariants = {
  initial: { fillOpacity: 1 },
  animate: { fillOpacity: [0, 1, 0], transition: { duration: 0.3, repeat: 3 } },
};

const navVariants = {
  black: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  transparent: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
};

interface IForm {
  keyword: string;
}
function Header() {
  const isInHome = useMatch(`${process.env.PUBLIC_URL}/`);
  const isInTv = useMatch(`${process.env.PUBLIC_URL}/tv`);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const { scrollY } = useViewportScroll();
  const navAnimation = useAnimation();
  const { register, handleSubmit } = useForm<IForm>();
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsOpenSearch((current) => !current);
  };
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start("black");
      } else {
        navAnimation.start("transparent");
      }
    });
  }, [scrollY, navAnimation]);
  const onSubmit = (data: IForm) => {
    navigate(`${process.env.PUBLIC_URL}/search?keyword=${data.keyword}`);
  };
  return (
    <Nav variants={navVariants} initial="transparent" animate={navAnimation}>
      <Column>
        <Logo viewBox="0 0 1024 276.742">
          <motion.path
            variants={logoVariants}
            initial="initial"
            whileHover="animate"
            strokeWidth={5}
            stroke="white"
            fill="red"
            d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
          />
        </Logo>
        <Items>
          <Item>
            <Link to={`${process.env.PUBLIC_URL}/`}>Home</Link>
            {isInHome ? <Circle layoutId="circle" /> : null}
          </Item>
          <Item>
            <Link to={`${process.env.PUBLIC_URL}/tv`}>TV Shows</Link>
            {isInTv ? <Circle layoutId="circle" /> : null}
          </Item>
        </Items>
      </Column>
      <Column>
        <Search onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isOpenSearch ? 1 : 0 }}
            transition={{ type: "linear" }}
            placeholder="Search for movie or TV shows..."
          />
          <SearchBtn
            animate={{ x: isOpenSearch ? -243 : 0 }}
            transition={{ type: "linear" }}
            onClick={toggleSearch}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="white"
              d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
            />
          </SearchBtn>
        </Search>
      </Column>
    </Nav>
  );
}

export default Header;
