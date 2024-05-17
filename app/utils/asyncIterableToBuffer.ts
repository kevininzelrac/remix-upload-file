const asyncIterableToBuffer = async (data: AsyncIterable<Uint8Array>) => {
  const result = [];
  for await (const chunk of data) {
    result.push(chunk);
  }
  return Buffer.concat(result);
};
export default asyncIterableToBuffer;
