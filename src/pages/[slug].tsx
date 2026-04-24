import Detail from "src/routes/Detail"
import { filterPosts } from "src/libs/utils/notion"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "src/routes/Error"
import { getRecordMap, getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { dehydrate } from "@tanstack/react-query"
import usePostQuery from "src/hooks/usePostQuery"
import { FilterPostsOptions } from "src/libs/utils/notion/filterPosts"

const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

export const getStaticPaths = async () => {
  const posts = await getPosts()
  const filteredPost = filterPosts(posts, filter)

  return {
    paths: filteredPost.map((row) => `/${row.slug}`),
    fallback: true,
  }
}

// Utility function to sanitize data
function sanitizeData(data: any): any {
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  } else if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (key === "thumbnail" && value === undefined) {
          return [key, null];
        }
        if (key === "author" && Array.isArray(value)) {
          return [
            key,
            value.map((author) => ({
              ...author,
              id: author.id ?? null,
              name: "Damy"
            })),
          ];
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

  const recordMap = await getRecordMap(sanitizedPostDetail.id!);

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

const DetailPage: NextPageWithLayout = () => {
  const post = usePostQuery()

  if (!post) return <CustomError />

  const image =
    post.thumbnail ??
    CONFIG.ogImageGenerateURL ??
    `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(post.title)}.png`

  const date = post.date?.start_date || post.createdTime || ""

  const meta = {
    title: post.title,
    date: new Date(date).toISOString(),
    image: image,
    description: post.summary || "",
    type: post.type[0],
    url: `${CONFIG.link}/${post.slug}`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Detail />
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
