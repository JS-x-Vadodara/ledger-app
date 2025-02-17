import { NotionService } from "../services/notion-service";

export default async function Home() {
  const notionService = new NotionService(
    process.env.NOTION_CLIENT_ID as string,
    process.env.NOTION_DATABASE_ID as string
  );

  const data = await notionService.fetchData();
  const totalExpense = notionService.getTotalExpense();
  const totalIncome = notionService.getTotalIncome();
  const totalBalance = notionService.getTotalBalance();

  return (
    <div>
      <div className="flex py-12 w-full justify-center items-center">
        <div className="text-4xl">
          JS x Vadodara
        </div>
      </div>
      <div className="space-y-8">
        <div className="flex w-full justify-evenly">
          <div className="border p-4"> Total Income: {totalIncome || 0}</div>
          <div className="border p-4"> Total Expense: {totalExpense || 0}</div>
          <div className="border p-4"> Total Balance: {totalBalance || 0}</div>
        </div>
        <div className="flex justify-center">
          <table className="border-2 border-gray-500">
            <thead className="">
              <tr className="space-x-4">
                <th className="px-4 py-2 border border-gray-700 text-left">
                  ID
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left">
                  Date
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left">
                  Title
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left">
                  Category
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left">
                  Note
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left">
                  Income
                </th>
                <th className="px-4 py-2 border border-gray-700 text-left">
                  Expense
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item?.properties?.ID?.unique_id?.number}>
                    {/* ID */}
                    <td className="px-4 py-2 border border-gray-700 text-left">
                      {item?.properties?.ID?.unique_id?.number || 'N/A'}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-2 border border-gray-700 text-left">
                      {item?.properties?.Date?.date?.start || "N/A"}
                    </td>
                    {/* Title */}
                    <td className="px-4 py-2 border border-gray-700 text-left">
                      {item?.properties?.Title?.title?.[0]?.text?.content || "-"}
                    </td>
                    {/* Category */}
                    <td className="px-4 py-2 border border-gray-700 text-left">
                      {item?.properties?.Category?.rich_text?.[0]?.text?.content || "-"}
                    </td>
                    {/* Note */}
                    <td className="px-4 py-2 border border-gray-700 text-left">
                      {item?.properties?.Note?.rich_text?.[0]?.text?.content || "-"}
                    </td>
                    {/* Income */}
                    <td className="px-4 py-2 border border-gray-700 text-left">
                      {item?.properties?.Income?.number || 0}
                    </td>
                    {/* Expense */}
                    <td className="px-4 py-2 border border-gray-700 text-left">
                      {item?.properties?.Expense?.number || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
