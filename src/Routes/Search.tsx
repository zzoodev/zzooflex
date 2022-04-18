import { useLocation } from "react-router-dom";
import { getSearchedMovies, ISearchedMovies, ISearchedMovie } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../util";
import { useEffect, useState } from "react";
import { off } from "process";

const MovieSlider = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  margin-top: 100px;
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;
const TvSlider = styled(MovieSlider)``;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  height: 100%;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgmovie: string }>`
  height: 100%;
  background-image: url(${(props) => props.bgmovie});
  background-position: center;
  background-size: cover;
`;
const NextBtn = styled.button`
  height: 50px;
  width: 60px;
  font-size: 18px;
  position: absolute;
  top: 50%;
  right: 0px;
  z-index: 3;
`;
const PrevBtn = styled.button`
  height: 50px;
  width: 60px;
  font-size: 18px;
  position: absolute;
  top: 50%;
  left: 0px;
  z-index: 3;
`;

const LoadingPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 38px;
`;
const Wrap = styled.div`
  width: 100%;
  height: max-content;
  padding: 20px 60px;
`;
const Intro = styled.h2`
  margin-top: 80px;
  color: ${(props) => props.theme.white.darker};
  font-size: 16px;
  font-weight: 200;
  margin-bottom: 10px;
  strong {
    font-weight: bold;
    font-size: 18px;
    margin-left: 5px;
  }
`;
const Contents = styled(motion.section)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  column-gap: 10px;
  row-gap: 50px;
  margin: 0 auto;
`;
const Content = styled(motion.div)<{ bg: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 130px;
  background: url(${(props) => props.bg});
  background-color: gray;
  background-position: center center;
  background-size: cover;
  position: relative;
`;
const Info = styled(motion.p)`
  opacity: 0;
  width: 100%;
  height: 30px;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  bottom: -20px;
`;

const contentVariant = {
  initial: {},
  hover: {
    scale: 1.3,
    zIndex: 2,
    y: -30,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    },
  },
};

function Search() {
  const location = useLocation();
  let keyword = new URLSearchParams(location.search).get("keyword");
  let { data, isLoading } = useQuery<ISearchedMovies>(["movies", keyword], () =>
    getSearchedMovies(keyword as string)
  );
  const offset = 5;

  const [movieIndex, setMovieIndex] = useState(0);
  const [movieIsBack, setMovieIsBack] = useState(false);

  const [tvIndex, setTvIndex] = useState(0);
  const [tvIsBack, setTvIsBack] = useState(false);

  const onPrevClick = () => {
    setMovieIsBack(true);
    const totalMovie = data?.results.filter(
      (item) => item.media_type === "movie"
    ).length;
    const maxMovieIndex = Math.floor(totalMovie! / offset) - 1;
    setMovieIndex((index) => (index === 0 ? maxMovieIndex : index - 1));
  };
  const onNextClick = () => {
    setMovieIsBack(false);
    const totalMovie = data?.results.filter(
      (item) => item.media_type === "movie"
    ).length;
    const maxMovieIndex = Math.floor(totalMovie! / offset) - 1;
    setMovieIndex((index) => (index === maxMovieIndex ? 0 : index + 1));
  };
  const onPrev = () => {
    setTvIsBack(true);
    const totalTv = data?.results.filter(
      (item) => item.media_type === "tv"
    ).length;
    const maxTvIndex = Math.floor(totalTv! / offset) - 1;
    setTvIndex((index) => (index === 0 ? maxTvIndex : index - 1));
  };
  const onNext = () => {
    setTvIsBack(false);
    const totalTv = data?.results.filter(
      (item) => item.media_type === "tv"
    ).length;
    const maxTvIndex = Math.floor(totalTv! / offset) - 1;
    setTvIndex((index) => (index === maxTvIndex ? 0 : index + 1));
  };

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

  return (
    <Wrap>
      {isLoading ? (
        <LoadingPage></LoadingPage>
      ) : (
        <>
          <MovieSlider>
            <h2>Searched Movies</h2>
            <PrevBtn onClick={onPrevClick}>Prev</PrevBtn>
            <NextBtn onClick={onNextClick}>Next</NextBtn>
            <AnimatePresence initial={false}>
              <Row
                key={movieIndex}
                variants={RowVariants}
                custom={movieIsBack}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "just" }}
              >
                {data?.results
                  .filter((item) => item.media_type === "movie")
                  ?.slice(movieIndex * offset, movieIndex * offset + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      bgmovie={makeImagePath(movie.backdrop_path, "w500")}
                    ></Box>
                  ))}
              </Row>
            </AnimatePresence>
          </MovieSlider>
          <TvSlider>
            <h2>Searched Tvs</h2>
            <PrevBtn onClick={onPrev}>Prev</PrevBtn>
            <NextBtn onClick={onNext}>Next</NextBtn>
            <AnimatePresence initial={false}>
              <Row
                key={tvIndex}
                variants={RowVariants}
                custom={tvIsBack}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "just" }}
              >
                {data?.results
                  .filter((item) => item.media_type === "tv")
                  ?.slice(tvIndex * offset, tvIndex * offset + offset)
                  .map((tv) => (
                    <Box
                      key={tv.id}
                      bgmovie={makeImagePath(tv.backdrop_path, "w500")}
                    ></Box>
                  ))}
              </Row>
            </AnimatePresence>
          </TvSlider>
          <Intro>
            All contents:
            <strong>{keyword}</strong>
          </Intro>
          <Contents>
            {data?.results.map((content) => (
              <Content
                key={content.id}
                bg={makeImagePath(content.backdrop_path, "w300") || ""}
                whileHover="hover"
                variants={contentVariant}
              >
                <h3>{content.backdrop_path ? null : content.original_title}</h3>
                <Info variants={infoVariants}>
                  {content.original_title
                    ? content.original_title
                    : "title not founded"}
                </Info>
              </Content>
            ))}
          </Contents>
        </>
      )}
    </Wrap>
  );
}

export default Search;
