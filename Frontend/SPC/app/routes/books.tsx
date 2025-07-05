import BooksList from "../components/BooksList";
import PageWrapper from "../components/PageWrapper";

export default function BooksPage() {
  return (
    <PageWrapper className="bg-gray-50">
      <div className="container mx-auto py-8">
        <BooksList />
      </div>
    </PageWrapper>
  );
} 