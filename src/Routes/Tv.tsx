import {
  getAiringTodayTv,
  getLatestTv,
  getPopularTv,
  getTopRatedTv,
} from "../api";
import { useQuery, useQueries } from "react-query";
import styled from "styled-components";
import { ILatestTv, IAirTodayTvs, IPopulaTvs, ITopRatedTvs } from "../api";
import { makeImagePath } from "../util";
import { motion, AnimatePresence } from "framer-motion";
import React, { ReactEventHandler, useState } from "react";
import { off } from "process";

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
const Slider = styled.article`
  width: 100%;
  height: 200px;
  background-color: #fff;
  margin-bottom: 30px;
  position: relative;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  height: 100%;
`;
const NextBtn = styled(motion.button)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;
const PrevBtn = styled(motion.button)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;
const Box = styled(motion.div)<{ bgimg: string }>`
  background: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center;
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
  const offset = 6;

  const onNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const sliderId = event.currentTarget.parentElement?.parentElement?.id;
  };

  const airingIndex = 0;

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
            <>
              <h3>{sliderName[sliderIndex]}</h3>
              <Slider key={sliderIndex} id={sliderIndex + ""}>
                <AnimatePresence>
                  <Row>
                    {data?.results
                      .slice(
                        airingIndex * offset,
                        airingIndex * offset + offset
                      )
                      .map((item, boxIndex) => (
                        <Box
                          key={boxIndex}
                          bgimg={makeImagePath(item.backdrop_path)}
                        ></Box>
                      ))}
                    <PrevBtn>Prev</PrevBtn>
                    <NextBtn onClick={onNextClick}>Next</NextBtn>
                  </Row>
                </AnimatePresence>
              </Slider>
            </>
          ))}
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
