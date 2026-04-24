import { NotionAPI } from "notion-client"

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI({apiBaseUrl: "https://pie-roundworm-fd6.notion.site/1a65c12abe088053af87c0b63587e8f0"});
  const recordMap = await api.getPage(pageId)
  return recordMap
}
