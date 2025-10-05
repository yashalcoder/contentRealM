import ViewContent from "../../../components/ViewContent";
export default function ViewContentPage(post_id) {
  return <ViewContent params={post_id} />;
}
{
  /* Action Buttons */
}
// <div className="mt-4 flex space-x-2">
//   <Link href={`/view-content/${item.id}`} className="flex-1">
//     <div className="btn-primary text-sm py-2 text-center">
//       View Content
//     </div>
//   </Link>

//   {item.hasVideo && (
//     <Link href={`/view-clips/${item.id}`}>
//       <button
//         className="px-3 py-2 text-purple-400 hover:text-purple-300 border border-purple-600/30 rounded-lg hover:border-purple-500/50 bg-purple-900/20 transition-all"
//         title="View video clips"
//       >
//         🎬
//       </button>
//     </Link>
//   )}
