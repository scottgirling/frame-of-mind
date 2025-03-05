import signIn from "@/app/auth/signIn";

export default async function handleEmailLogin(email, password, setLoading) {
  setLoading(true);
  const { error } = await signIn(email, password);
  setLoading(false);
  if (error) {
    return console.log(error);
  }
}
