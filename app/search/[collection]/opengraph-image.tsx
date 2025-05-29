import OpengraphImage from 'components/opengraph-image';
import { getCategory } from 'lib/swell';

export const runtime = 'edge';

export default async function Image({ params }: { params: { collection: string } }) {
  const collection = await getCategory(params.collection);
  const title = collection?.name;

  return await OpengraphImage({ title });
}
