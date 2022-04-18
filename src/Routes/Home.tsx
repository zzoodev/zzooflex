import {
  getLatestMovie,
  getNowPlayMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetNowPlayMovies,
  ILatestMovie,
  ITopRatedMovies,
  IUpcomingMovies,
} from "../api";
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
  height: 90vh;
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
  height: 200px;
  margin-bottom: 100px;
  h2 {
    font-size: 28px;
    font-weight: bold;
    margin: 5px 10px;
    color: tomato;
  }
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;
const NextBtn = styled(motion.button)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
`;
const PrevBtn = styled(motion.button)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 50px;
  font-size: 18px;
  font-weight: bold;
`;
const Box = styled(motion.div)<{ bgimg: string }>`
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
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
  initial: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 1,
  }),
  animate: {
    x: 0,
  },
  exit: (isBack: boolean) => {
    return { x: isBack ? window.outerWidth + 5 : -window.outerWidth - 1 };
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
  const { data: latestData, isLoading: latestLoading } = useQuery<ILatestMovie>(
    ["movie", "latest"],
    getLatestMovie
  );
  const { data: nowData, isLoading } = useQuery<IGetNowPlayMovies>(
    ["movie", "nowPlaying"],
    getNowPlayMovies
  );
  const { data: topData, isLoading: topLoading } = useQuery<ITopRatedMovies>(
    ["movie", "topRated"],
    getTopRatedMovies
  );
  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<IUpcomingMovies>(["movie", "upcoming"], getUpcomingMovies);

  const [nowIndex, setNowIndex] = useState(0);
  const [isNowBack, setIsNowBack] = useState(false);

  const [topIndex, setTopIndex] = useState(0);
  const [isTopBack, setIsTopBack] = useState(false);

  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [isUpcomingBack, setIsUpcomingBack] = useState(false);

  const nowNext = () => {
    if (nowData) {
      if (isSliding) return;
      setIsNowBack(false);
      toggleSliding();
      const totalMovie = nowData?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setNowIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const nowPrev = () => {
    if (nowData) {
      if (isSliding) return;
      setIsNowBack(true);
      toggleSliding();
      const totalMovie = nowData?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setNowIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const topNext = () => {
    if (topData) {
      if (isSliding) return;
      setIsTopBack(false);
      toggleSliding();
      const totalMovie = topData?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const topPrev = () => {
    if (topData) {
      if (isSliding) return;
      setIsTopBack(true);
      toggleSliding();
      const totalMovie = topData?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setTopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const upcomingNext = () => {
    if (upcomingData) {
      if (isSliding) return;
      setIsUpcomingBack(false);
      toggleSliding();
      const totalMovie = upcomingData?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const upcomingPrev = () => {
    if (upcomingData) {
      if (isSliding) return;
      setIsUpcomingBack(true);
      toggleSliding();
      const totalMovie = upcomingData?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setUpcomingIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleSliding = () => {
    setIsSliding((prev) => !prev);
  };
  const [isSliding, setIsSliding] = useState(false);
  const offset = 6;
  const navigate = useNavigate();
  const infoPageMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();

  const clickedMovie: any =
    infoPageMatch?.params.movieId &&
    nowData?.results.find(
      (movie) => movie.id === +infoPageMatch.params.movieId!
    );

  return (
    <Wrapper>
      {isLoading ? (
        <LoadingPage>Loading...</LoadingPage>
      ) : (
        <>
          <Banner
            bgimg={makeImagePath(
              latestData?.backdrop_path || latestData?.poster_path || ""
            )}
          >
            <h3>Latest Movie</h3>
            <Title>{latestData?.title}</Title>
            <p>{latestData?.overview}</p>
          </Banner>

          <Slider>
            <h2>Now Play</h2>
            <AnimatePresence initial={false} onExitComplete={toggleSliding}>
              <Row
                key={nowIndex}
                custom={isNowBack}
                variants={RowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
              >
                {nowData?.results
                  .slice(1)
                  .slice(nowIndex * offset, nowIndex * offset + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() =>
                        navigate(`../movies/${movie.id}`, {
                          state: {
                            id: movie.id,
                            bgimg: movie.backdrop_path,
                            overview: movie.overview,
                            title: movie.title,
                          },
                        })
                      }
                      variants={boxVariants}
                      initial="nomal"
                      id={movie.id + ""}
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
            <PrevBtn onClick={nowPrev}>Prev</PrevBtn>
            <NextBtn onClick={nowNext}>Next</NextBtn>
          </Slider>

          <Slider>
            <h2>Top Rated</h2>
            <AnimatePresence initial={false} onExitComplete={toggleSliding}>
              <Row
                key={topIndex}
                custom={isTopBack}
                variants={RowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
              >
                {topData?.results
                  .slice(topIndex * offset, topIndex * offset + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() =>
                        navigate(`../movies/${movie.id}`, {
                          state: {
                            id: movie.id,
                            bgimg: movie.backdrop_path,
                            overview: movie.overview,
                            title: movie.title,
                          },
                        })
                      }
                      variants={boxVariants}
                      id={movie.id + ""}
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
            <PrevBtn onClick={topPrev}>Prev</PrevBtn>
            <NextBtn onClick={topPrev}>Next</NextBtn>
          </Slider>

          <Slider>
            <h2>Upcoming Movies</h2>
            <AnimatePresence initial={false} onExitComplete={toggleSliding}>
              <Row
                key={upcomingIndex}
                custom={isUpcomingBack}
                variants={RowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
              >
                {upcomingData?.results
                  .slice(
                    upcomingIndex * offset,
                    upcomingIndex * offset + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      id={movie.id + ""}
                      onClick={() =>
                        navigate(`../movies/${movie.id}`, {
                          state: {
                            id: movie.id,
                            bgimg: movie.backdrop_path,
                            overview: movie.overview,
                            title: movie.title,
                          },
                        })
                      }
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
            <PrevBtn onClick={upcomingPrev}>Prev</PrevBtn>
            <NextBtn onClick={upcomingNext}>Next</NextBtn>
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
