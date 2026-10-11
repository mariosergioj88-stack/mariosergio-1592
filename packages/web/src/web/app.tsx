import { Route, Switch } from "wouter";
import Home from "./pages/home";
import { About, Team, Semeq, Gallery, Contact } from "./pages/institutional";
import { Events, Calendar } from "./pages/events";
import Quiz from "./pages/quiz";
import Admin from "./pages/admin";
import { Layout, Empty } from "./components/site";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sobre" component={About} />
          <Route path="/equipe" component={Team} />
          <Route path="/eventos" component={Events} />
          <Route path="/semeq" component={Semeq} />
          <Route path="/calendario" component={Calendar} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/galeria" component={Gallery} />
          <Route path="/contato" component={Contact} />
          <Route path="/admin" component={Admin} />
          <Route>
            <Empty title="Página não encontrada.">
              Use a navegação para explorar o GEMEDE.
            </Empty>
          </Route>
        </Switch>
      </Layout>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
