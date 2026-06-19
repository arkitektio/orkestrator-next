import { useFrom_File_LikeMutation } from "@/mikro-next/api/graphql";

export const useCreateFile = () => {
  const [createFile] = useFrom_File_LikeMutation({
    refetchQueries: ["GetFiles"]
  });

  const upload = async (file: File, key: string) => {
    await createFile({
      variables: {
        file: key,
        name: file.name,
      },
    });
  };

  return upload;
};
