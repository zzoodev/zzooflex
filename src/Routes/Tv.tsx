import {
  getAiringTodayTv,
  getLatestTv,
  getPopularTv,
  getTopRatedTv,
  getTv,
} from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { ILatestTv, IAirTodayTvs, IPopulaTvs, ITopRatedTvs } from "../api";
import { makeImagePath } from "../util";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import React, { useState } from "react";
import { useMatch, useNavigate, useLocation } from "react-router-dom";
import { url } from "inspector";

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
const Banner = styled.section<{ bg: string | null }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 90vh;
  width: 100%;
  padding: 0px 80px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)),
    url(${(props) => props.bg});
  background-position: top center;
  background-size: cover;
  h2 {
    font-size: 48px;
    margin-top: 100px;
    margin-bottom: 10px;
  }
  p {
    width: 50%;
  }
`;
const SliderWrap = styled.div`
  h5 {
    font-size: 28px;
    font-weight: bold;
    margin: 5px 10px;
    color: tomato;
  }
`;
const Slider = styled(motion.article)`
  width: 100%;
  height: 200px;
  margin-bottom: 30px;
  position: relative;
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  width: 100%;
  height: 100%;
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
  background: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center;
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
  padding: 20px;
  box-sizing: border-box;
  h3 {
    font-size: 24px;
    font-weight: bold;
  }
  strong {
    font-size: 18px;
    color: gold;
    margin: 10px 0px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  opacity: 0;
`;

function Tv() {
  const { isLoading: latestLoading, data: latestData } = useQuery<ILatestTv>(
    ["tv", "latest"],
    getLatestTv
  );
  const { isLoading: airingLoading, data: airingData } = useQuery<IAirTodayTvs>(
    ["tv", "airingToday"],
    getAiringTodayTv
  );
  const { isLoading: populaLoading, data: populaData } = useQuery<IPopulaTvs>(
    ["tv", "popula"],
    getPopularTv
  );
  const { isLoading: topRatedLoading, data: topRatedData } =
    useQuery<ITopRatedTvs>(["tv", "topRated"], getTopRatedTv);

  const sliderData = [airingData, populaData, topRatedData];
  const sliderName = [
    "Airing Today Tv Show",
    "Popula Tv Show",
    "Top Rated Tv Show",
  ];
  const [airingIndex, setAiringIndex] = useState(0);
  const [populaIndex, setPopulaIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  let indexArray = [
    { index: airingIndex, indexName: "airingIndex" },
    { index: populaIndex, indexName: "populaIndex" },
    { index: topRatedIndex, indexName: "topRatedIndex" },
  ];
  const offset = 5;
  const [isSliding, setIsSliding] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const toggleSliding = () => {
    setIsSliding((prev) => !prev);
  };

  const onNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const sliderId = Number(event.currentTarget.parentElement?.id);
    setIsBack(false);
    setIsSliding(true);
    switch (sliderId) {
      case 0:
        if (isSliding) return;
        setAiringIndex((prev) => {
          const totalTv: any = sliderData[sliderId]?.results.length;
          const maxIndex: number = Math.floor(totalTv / offset) - 1;
          return prev === maxIndex ? 0 : prev + 1;
        });
        break;
      case 1:
        if (isSliding) return;
        setPopulaIndex((prev) => {
          const totalTv: any = sliderData[sliderId]?.results.length;
          const maxIndex: number = Math.floor(totalTv / offset) - 1;
          return prev === maxIndex ? 0 : prev + 1;
        });
        break;
      default:
        if (isSliding) return;
        setTopRatedIndex((prev) => {
          const totalTv: any = sliderData[sliderId]?.results.length;
          const maxIndex: number = Math.floor(totalTv / offset) - 1;
          return prev === maxIndex ? 0 : prev + 1;
        });
        break;
    }
  };

  const onPrevClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const sliderId = Number(event.currentTarget.parentElement?.id);
    setIsBack(true);
    setIsSliding(true);
    switch (sliderId) {
      case 0:
        if (isSliding) return;
        setAiringIndex((prev) => {
          const totalTv: any = sliderData[sliderId]?.results.length;
          const maxIndex: number = Math.floor(totalTv / offset) - 1;
          return prev === 0 ? maxIndex : prev - 1;
        });
        break;
      case 1:
        if (isSliding) return;
        setPopulaIndex((prev) => {
          const totalTv: any = sliderData[sliderId]?.results.length;
          const maxIndex: number = Math.floor(totalTv / offset) - 1;
          return prev === 0 ? maxIndex : prev - 1;
        });
        break;
      default:
        if (isSliding) return;
        setTopRatedIndex((prev) => {
          const totalTv: any = sliderData[sliderId]?.results.length;
          const maxIndex: number = Math.floor(totalTv / offset) - 1;
          return prev === 0 ? maxIndex : prev - 1;
        });
        break;
    }
  };

  interface ITvData {
    id: number;
    name: string;
    vote_average: number;
    overview: string;
  }
  const infoPageMatch = useMatch(`/tv/:tvId`);
  const [tvData, setTvData] = useState<ITvData>();
  const { state }: any = useLocation();

  if (state) {
  }

  const onBoxClick = async (id: any) => {
    const data = await (
      await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=e51171931820c845ce6637f3e578d769`
      )
    ).json();
    setTvData(data);
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
    <Wrapper>
      {latestLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Banner
            bg={
              latestData?.poster_path
                ? makeImagePath(latestData?.poster_path)
                : null
            }
          >
            {!latestData?.poster_path ? <strong>Not Image</strong> : null}
            <h2>{latestData?.name}</h2>
            <p>{latestData?.overview}</p>
          </Banner>

          {sliderData.map((data, sliderIndex) => (
            <SliderWrap key={sliderIndex + ""}>
              <h5>{sliderName[sliderIndex]}</h5>
              <Slider id={sliderIndex + ""}>
                <AnimatePresence initial={false} onExitComplete={toggleSliding}>
                  <Row
                    id={sliderIndex + ""}
                    key={indexArray[sliderIndex].index}
                    variants={RowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={isBack}
                    transition={{ type: "tween", duration: 0.7 }}
                  >
                    {data?.results
                      .slice(
                        indexArray[sliderIndex].index * offset,
                        indexArray[sliderIndex].index * offset + offset
                      )
                      .map((item) => (
                        <Box
                          id={item.id + ""}
                          layoutId={item.id + ""}
                          bgimg={makeImagePath(item.backdrop_path, "w500")}
                          onClick={() => {
                            onBoxClick(item.id);
                            navigate(`/tv/${item.id + ""}`, {
                              state: {
                                tvId: item.id,
                                bgpath: item.backdrop_path,
                              },
                            });
                          }}
                        ></Box>
                      ))}
                  </Row>
                  <PrevBtn onClick={onPrevClick}>Prev</PrevBtn>
                  <NextBtn onClick={onNextClick}>Next</NextBtn>
                </AnimatePresence>
              </Slider>
            </SliderWrap> // slider
          ))}
          <AnimatePresence>
            {infoPageMatch ? (
              <>
                <InfoPage
                  layoutId={infoPageMatch.params.tvId + ""}
                  style={{ top: scrollY.get() + 100, zIndex: 3 }}
                >
                  <InfoPageBg
                    style={{
                      backgroundImage: `url(${makeImagePath(state.bgpath)})`,
                    }}
                  ></InfoPageBg>
                  <InfoPageInfo>
                    <h3>Title: {tvData?.name}</h3>
                    <strong>Rating: {tvData?.vote_average}</strong>
                    <p>Overview: {tvData?.overview}</p>
                  </InfoPageInfo>
                </InfoPage>
                <Overlay
                  onClick={() => navigate(`/tv`)}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
              </>
            ) : null}
          </AnimatePresence>
        </> // tv page
      )}
    </Wrapper>
  );
}

export default Tv;
