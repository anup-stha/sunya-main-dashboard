import { MainLayout } from "@/layout/MainLayout";
import { TestDetails } from "@/modules/tests/testDetails";
import { testStore } from "@/modules/tests/testStore";
import { listTest } from "@/services/requests/testRequests";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";

const Test: NextPage<any> = ({ idX }) => {
  const { setSelectedTest, setTestList, setLoading, loading } = testStore();

  useEffect(() => {
    const listTestFn = async () => {
      setLoading(true);
      await listTest()
        .then((res) => {
          setTestList(res.data.data);
          setSelectedTest(
            res.data.data.filter((test) => test.name.toLowerCase() === idX)[0]
          );
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    listTestFn();
  }, [idX]);

  return (
    <MainLayout>{!loading ? <TestDetails /> : <div>Loading</div>}</MainLayout>
  );
};

export default Test;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      idX: context.query.test,
    },
  };
};