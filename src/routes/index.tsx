import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <h1>Route Examples</h1>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/login">/login</Link>
        <Link to="/explore">/explore</Link>
        <Link to="/$profile_name" params={{ profile_name: 'user1' }}>
          /user1
        </Link>
        <Link to="/$profile_name/saved" params={{ profile_name: 'user1' }}>
          /user1/saved
        </Link>
        <Link
          to="/stories/$profile_name/$story_id"
          params={{ profile_name: 'user1', story_id: '123' }}
        >
          /stories/user1/123
        </Link>
        <Link
          to="/p/$profile_name"
          params={{ profile_name: 'user1' }}
          search={{ img_index: 2 }}
        >
          /p/user1?img_index=2
        </Link>
      </div>
    </div>
  )
}
