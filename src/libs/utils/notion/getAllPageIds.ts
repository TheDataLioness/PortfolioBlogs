import { idToUuid } from "notion-utils";
import { ExtendedRecordMap, ID } from "notion-types";

export default function getAllPageIds(
  response: ExtendedRecordMap,
  viewId?: string
) {


  const collectionQuery = response.collection_query;
  if (!collectionQuery || Object.keys(collectionQuery).length === 0) {
    console.error("collection_query is empty or undefined:", collectionQuery);
    return [];
  }

  const views = Object.values(collectionQuery)[0];
  if (!views) {
    console.error("Views not found in collection_query:", collectionQuery);
    return [];
  }

  let pageIds: ID[] = [];
  if (viewId) {
    const vId = idToUuid(viewId);
    pageIds = views[vId]?.blockIds || [];
  } else {
    const pageSet = new Set<ID>();
    Object.values(views).forEach((view: any) => {
      view?.collection_group_results?.blockIds?.forEach((id: ID) =>
        pageSet.add(id)
      );
    });
    pageIds = [...pageSet];
  }

  return pageIds;
}