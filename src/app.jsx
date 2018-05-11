require('normalize.css');
require('./css/style.less');
import {Route} from 'react-router-dom';
import {Layout} from 'antd';

const App = () => (
    <Layout>
        <Layout.Header>Header</Layout.Header>
        <Layout.Content>
            <h1>Hello, world</h1>;
        </Layout.Content>
    </Layout>
);

export default class extends React.Component {
    render() {
        return (
            <Route>
                <Route exact path="/" component={App} />
            </Route>
        );
    }
}
