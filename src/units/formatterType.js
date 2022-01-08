export default function formatterType(type) {
  switch (type) {
    case "STORE_IN":
      return "入庫";
    case "STORE_OUT":
      return "出庫";
    default:
      return "未知";
  }
}
