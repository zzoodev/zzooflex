import { getPopularTv, getTopRatedTv } from "../api";
import { useQuery, useQueries } from "react-query";
import styled from "styled-components";
import { IPopulaTvs, ITopRatedTvs } from "../api";
import { makeImagePath } from "../util";
import { motion, AnimatePresence } from "framer-motion";
import React, { ReactEventHandler, useState } from "react";

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
const Banner = styled.section<{ bgImg: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100vh;
  width: 100%;
  padding: 0px 80px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)),
    url(${(props) => props.bgImg});
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
  &:nth-of-type(1) {
    margin-top: -100px;
  }
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, 6fr);
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
const Box = styled(motion.div)`
  background-color: gray;
`;

function Tv() {
  // const { isLoading: populaLoading, data: populaData } = useQuery<IPopulaTvs>(
  //   ["tv", "populaTv"],
  //   getPopularTv
  // );
  // const { isLoading: topRatedLoading, data: topRatedData } =
  //   useQuery<ITopRatedTvs>(["tv", "topRated"], getTopRatedTv);
  const queries = useQueries([
    {
      queryKey: ["tv", "populaTv"],
      queryFn: getPopularTv,
    },
    {
      queryKey: ["te", "topRatedTv"],
      queryFn: getTopRatedTv,
    },
  ]);

  const next = (event: React.MouseEvent<HTMLButtonElement>) => {
    const sliderIndex = event.currentTarget.parentElement?.parentElement?.id;
  };

  return (
    <Wrapper>
      {queries[queries.length - 1].isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Banner
            bgImg={makeImagePath(
              queries[0].data.results[0].backdrop_path || ""
            )}
          >
            <h2>{queries[0].data.results[0].name}</h2>
            <p>{queries[0].data.results[0].overview}</p>
          </Banner>
          {queries.map((query, index) => (
            <Slider key={index} id={index + ""}>
              <AnimatePresence>
                <Row>
                  <PrevBtn>Prev</PrevBtn>
                  <NextBtn onClick={next}>Next</NextBtn>
                </Row>
              </AnimatePresence>
            </Slider>
          ))}
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
