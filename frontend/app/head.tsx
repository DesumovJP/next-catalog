import { usePageTitle } from "./PageTitleContext";

export default function Head() {
  const { title } = usePageTitle();

  return (
    <>
      <title>{title}</title>
      <meta name="description" content="Опис сайту" />
    </>
  );
}