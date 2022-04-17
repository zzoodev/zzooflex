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
import { useMatch, useNavigate } from "react-router-dom";
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
const SliderWrap = styled.div``;
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
  const indexArray = [airingIndex, populaIndex, topRatedIndex];
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

  const infoPageMatch = useMatch(`/tv/:tvId`);
  const getTvData = async (id: any) => {
    const data = await (
      await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=e51171931820c845ce6637f3e578d769`
      )
    ).json();
  };
  // const allTv: any = {
  //   ...airingData?.results,
  //   ...populaData?.results,
  //   ...topRatedData?.results,
  // };
  // const clickedTv: any =
  //   infoPageMatch?.params.tvId &&
  //   allTv?.results.find((tv: any) => tv.id === +infoPageMatch.params.tvId!);

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
            <SliderWrap key={sliderIndex}>
              <h3>{sliderName[sliderIndex]}</h3>
              <Slider id={sliderIndex + ""}>
                <AnimatePresence initial={false} onExitComplete={toggleSliding}>
                  <Row
                    id={sliderIndex + ""}
                    key={indexArray[sliderIndex] + ""}
                    variants={RowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={isBack}
                    transition={{ type: "tween", duration: 0.7 }}
                  >
                    {data?.results
                      .slice(
                        indexArray[sliderIndex] * offset,
                        indexArray[sliderIndex] * offset + offset
                      )
                      .map((item) => (
                        <Box
                          id={item.id + ""}
                          layoutId={item.id + ""}
                          bgimg={makeImagePath(item.backdrop_path, "w500")}
                          onClick={() => getTvData(item.id)}
                        ></Box>
                      ))}
                  </Row>
                  <PrevBtn onClick={onPrevClick}>Prev</PrevBtn>
                  <NextBtn onClick={onNextClick}>Next</NextBtn>
                </AnimatePresence>
              </Slider>
            </SliderWrap> // slider
          ))}

          {/* <AnimatePresence>
            {infoPageMatch ? (
              <>
                <InfoPage
                  layoutId={infoPageMatch.params.tvId + ""}
                  style={{ top: scrollY.get() + 200 }}
                >
                  <InfoPageBg style={{}} />
                  <InfoPageInfo></InfoPageInfo>
                </InfoPage>
                <Overlay
                  onClick={() => navigate(`/tv`)}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
              </>
            ) : null}
          </AnimatePresence> */}
        </> // tv page
      )}
    </Wrapper>
  );
}

export default Tv;
