import { createRouter, useLocation, useNavigate } from '@solidjs/router';
import { buttonVariants } from '@taxon-labs/fern/button';
import { onSettled } from 'solid-js';
import { Layout } from './layout/layout';
import { pages } from './navigation';
import { createDocsTheme } from './theme';
import { PageIntro } from './ui';

export function App() {
  const [theme, setTheme] = createDocsTheme();

  const DocsRouter = createRouter({
    routes: [
      { path: '/', component: HomeRedirect },
      ...pages.map((page) => {
        const Page = page.component;

        return {
          path: page.path,
          component: () => (
            <>
              <PageIntro title={page.title} description={page.description} category={page.group} />
              <div class="fern-docs-content fern-prose">
                <Page theme={theme()} />
              </div>
            </>
          ),
        };
      }),
      { path: '*404', component: NotFound },
    ],
  });

  return (
    <DocsRouter>
      {(props) => (
        <Layout theme={theme()} onThemeChange={setTheme}>
          {props.children}
        </Layout>
      )}
    </DocsRouter>
  );
}

function HomeRedirect() {
  const navigate = useNavigate();
  const current = useLocation();

  onSettled(() =>
    navigate(`/foundations/colors${current.search}${current.hash}`, { replace: true }),
  );

  return null;
}

function NotFound() {
  return (
    <>
      <PageIntro
        category="404"
        title="Page not found"
        description="We couldn't find this page. Choose a page from the navigation or return to Colors."
      />
      <a href="/foundations/colors" class={buttonVariants({ variant: 'outline' })}>
        Explore colors
      </a>
    </>
  );
}
