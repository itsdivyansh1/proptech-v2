import axios from "../api/axios";

export async function propertyDetailLoader({ params }) {
  const { id } = params;
  try {
    const response = await axios.get(`/post/getpost/${id}`);
    return response.data.post;
  } catch (error) {
    console.error("Failed to fetch property data:", error);
    throw new Error("Failed to fetch property data");
  }
}
