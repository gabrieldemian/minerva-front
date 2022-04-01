import Link from 'next/link'

const Footer = () => (
  <footer className="bg-secondary p-2 mt-5">
    <div className="text-center">
      <p>
        Created by{' '}
        <Link href="https://github.com/gabrieldemian">
          <a target="_blank" className="underline text-purple-500">
            Gabriel
          </a>
        </Link>
        .
      </p>
    </div>
  </footer>
)

export default Footer
