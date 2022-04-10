import { useLocation } from "react-router-dom";
import { getSearchedMovies, ISearchedMovies } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImagePath } from "../util";

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

  return (
    <Wrap>
      {isLoading ? (
        <LoadingPage></LoadingPage>
      ) : (
        <>
          <Intro>
            다음과 관련된 컨텐츠:
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
