async function deleteMember() {
  const id = window.location.pathname.split("/member/")[1];
  await fetch(`/member/${id}`, { method: "DELETE" });
  window.location.replace("/members");
}
