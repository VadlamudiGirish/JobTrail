import Link from "next/link";
import { Application } from "@prisma/client";

type Props = {
  application: Application;
  locale: string;
};

export default function ApplicationRow({ application, locale }: Props) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-2">
        <Link
          href={`/${locale}/applications/${application.id}`}
          className="text-orange-600 hover:underline"
        >
          {application.jobTitle}
        </Link>
      </td>
      <td className="px-4 py-2">{application.applicationStatus}</td>
      <td className="px-4 py-2">
        {application.applicationDate.toLocaleDateString()}
      </td>
      <td className="px-4 py-2 text-right">
        <Link
          href={`/${locale}/applications/${application.id}/edit`}
          className="text-blue-600 hover:underline text-sm"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
}
