import { getNowPlayMovies, IGetNowPlayMovies } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../util";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";

const Wrapper = styled.div`
  height: 200vh;
`;
const LoadingPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 38px;
`;
const Banner = styled.div<{ bgimg: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 0px 80px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)),
    url(${(props) => props.bgimg});
  p {
    width: 50%;
  }
`;
const Title = styled.h2`
  font-size: 48px;
  margin-top: 100px;
  margin-bottom: 10px;
`;
const Slider = styled.div`
  position: relative;
  width: 100%;
  bottom: 100px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgimg: string }>`
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center center;
  height: 200px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const InfoPage = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40vw;
  height: 600px;
  border-radius: 10px;
  border: none;
  overflow: hidden;
  z-index: 2;
`;
const InfoPageBg = styled.div`
  width: 100%;
  height: 50%;
  overflow: hidden;
  background-size: cover;
  background-position: center center;
`;
const InfoPageInfo = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.black.lighter};
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  opacity: 0;
`;

// Variants
const RowVariants = {
  initial: {
    x: window.outerWidth + 5,
  },
  showing: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

function Home() {
  const { data, isLoading } = useQuery<IGetNowPlayMovies>(
    ["movie", "nowPlaying"],
    getNowPlayMovies
  );
  const [index, setIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (isSliding) return;
      toggleSliding();
      const totalMovie = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleSliding = () => {
    setIsSliding((prev) => !prev);
  };
  const offset = 6;
  const navigate = useNavigate();
  const infoPageMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();

  const clickedMovie: any =
    infoPageMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +infoPageMatch.params.movieId!);

  return (
    <Wrapper>
      {isLoading ? (
        <LoadingPage>Loading...</LoadingPage>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgimg={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <p>{data?.results[0].overview}</p>
          </Banner>

          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleSliding}>
              <Row
                key={index}
                variants={RowVariants}
                initial="initial"
                animate="showing"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
              >
                {data?.results
                  .slice(1)
                  .slice(index * offset, index * offset + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => navigate(`../movies/${movie.id}`)}
                      variants={boxVariants}
                      initial="nomal"
                      whileHover="hover"
                      transition={{ duration: 0.5, type: "tween" }}
                      key={movie.id}
                      bgimg={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {infoPageMatch?.params ? (
              <>
                <InfoPage
                  layoutId={infoPageMatch.params.movieId + ""}
                  style={{ top: scrollY.get() + 100 }}
                >
                  <InfoPageBg
                    style={{
                      backgroundImage: `url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  ></InfoPageBg>
                  <InfoPageInfo>
                    <h2>{clickedMovie.title}</h2>
                    <p>{clickedMovie.overview}</p>
                  </InfoPageInfo>
                </InfoPage>
                <Overlay
                  onClick={() => navigate(`/`)}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
