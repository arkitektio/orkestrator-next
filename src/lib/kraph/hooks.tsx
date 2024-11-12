import { useFrom_File_LikeMutation } from "@/kraph/api/graphql";

export const useCreateFile = () => {
  const [createFile] = useFrom_File_LikeMutation({
    refetchQueries: ["GetFiles"],
  });

  const upload = async (file: File, key: string) => {
    const { data } = await createFile({
      variables: {
        file: key,
        name: file.name,
      },
    });

    console.log("data", data);
  };

  return upload;
};
