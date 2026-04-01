import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function serializeTags(tags: string[]): string {
  return JSON.stringify(tags);
}

export function deserializeTags(tagsString: string): string[] {
  try {
    return JSON.parse(tagsString);
  } catch {
    return [];
  }
}

export function serializeArticle(article: any) {
  return {
    ...article,
    tags: deserializeTags(article.tags),
  };
}

export function serializeAppItem(appItem: any) {
  return {
    ...appItem,
    tags: deserializeTags(appItem.tags),
  };
}

export function prepareArticleData(data: any): any {
  return {
    ...data,
    tags: data.tags ? serializeTags(data.tags) : '[]',
  };
}

export function prepareAppItemData(data: any): any {
  return {
    ...data,
    tags: data.tags ? serializeTags(data.tags) : '[]',
  };
}
