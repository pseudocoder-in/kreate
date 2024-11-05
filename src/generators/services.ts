const getSeed = () => {
  return Math.floor(Math.random() * 1000000);
};

type HFProps = {
  modelEndpoint: string;
  token: string;
  imageWidth: number;
  imageHeight: number;
  prompt: string;
};

export const genrateUsingHF = async (props: HFProps) => {
  let response = await fetch(props.modelEndpoint, {
    signal: AbortSignal.timeout(90000),
    headers: {
      Authorization: "Bearer " + props.token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      inputs: props.prompt,
      target_size: {
        width: props.imageWidth,
        height: props.imageHeight,
      },
      seed: getSeed(),
    }),
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Failed to generate image");
  }
  const result = await response.blob();
  return result;
};
