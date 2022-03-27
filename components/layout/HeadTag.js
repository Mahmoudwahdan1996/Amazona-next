import React from "react";
import Head from "next/head";

const HeadTag = (props) => {
  const { title, description } = props;
  return (
    <Head>
      <title>{title ? `${title} - Next Amazona` : "Next Amazona"}</title>
      {description && <meta name="description" content={description}></meta>}
    </Head>
  );
};

export default HeadTag;
