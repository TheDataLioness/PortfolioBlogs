import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import {getPosts, getRecordMap} from "../apis";
import MetaConfig from "src/components/MetaConfig"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"
import {FilterPostsOptions} from "../libs/utils/notion/filterPosts";

const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

// Utility function to sanitize data
function sanitizeData(data: any): any {
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  } else if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (value === undefined) {
          return [key, null]; // Replace undefined with null
        }
        return [key, sanitizeData(value)];
      })
    );
  }
  return data;
}

// Updated getStaticProps
export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;

  const posts = await getPosts();
  const feedPosts = filterPosts(posts);
  await queryClient.prefetchQuery(queryKey.posts(), () => sanitizeData(feedPosts));

  const detailPosts = filterPosts(posts, filter);
  const postDetail = detailPosts.find((t: any) => t.slug === slug);

  const sanitizedPostDetail = sanitizeData(postDetail);

  // Check if the page ID is valid
  if (!sanitizedPostDetail?.id) {
    console.error("Invalid page ID:", sanitizedPostDetail?.id);
    return {
      notFound: true, // Return a 404 page if the page ID is invalid
    };
  }

  const recordMap = await getRecordMap(sanitizedPostDetail.id);

  const sanitizedData = sanitizeData({
    ...sanitizedPostDetail,
    recordMap,
  });

  await queryClient.prefetchQuery(queryKey.post(`${slug}`), () => sanitizedData);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  };
};

const FeedPage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Feed />
    </>
  )
}

export default FeedPage
