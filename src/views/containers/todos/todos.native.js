import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions';
import * as selectors from '../../../store/selectors';
import Drawer from '../../components/drawer';
import Container from '../../components/container';
import List from '../../components/todo-list';
import Input from './input';
import Item from './item';
import Menu from '../menu';

class TodosContainer extends Component {
  static propTypes = {
    completedIds: React.PropTypes.array.isRequired,
    uncompletedIds: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired,
    route: React.PropTypes.object.isRequired,
    onRemove: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      completedIds: props.completedIds,
      uncompletedIds: props.uncompletedIds,
    };
  }

  componentWillReceiveProps({ completedIds, uncompletedIds }) {
    if (completedIds !== this.props.completedIds) {
      this.setState({ completedIds });
    }

    if (uncompletedIds !== this.props.uncompletedIds) {
      this.setState({ uncompletedIds });
    }
  }

  handleDelete = (todo) => {
    const type = todo.completedAt ? 'completedIds' : 'uncompletedIds';
    const newState = { [type]: this.props[type].filter(tid => tid !== todo.id) };

    this.setState(newState, () => {
      const message = `"${todo.title}" será excluído permanentemente.`;
      const options = [
        { text: 'Não', style: 'cancel', onPress: () => this.setState({ [type]: this.props[type] }) },
        { text: 'Excluir', style: 'destructive', onPress: () => this.props.onRemove(todo) },
      ];

      setTimeout(() => Alert.alert('Excluir Tarefa?', message, options), 100);
    });
  };

  handleMenuPress = () => {
    this.drawer.handleOpenDrawer();
  };

  render() {
    const { completedIds, uncompletedIds, navigator, route } = this.props;

    return (
      <Drawer
        ref={ref => (this.drawer = ref)}
        menu={<Menu navigator={navigator} route={route} />}
      >
        <Container title="Caixa de Entrada" onMenuPress={this.handleMenuPress}>
          <List
            completedIds={completedIds}
            uncompletedIds={uncompletedIds}
            renderInput={() => <Input />}
            renderItem={id => <Item id={id} onRemove={this.handleDelete} />}
          />
        </Container>
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  const listId = selectors.getSelectedListId(state);

  return {
    completedIds: selectors.getCompletedTodoIds(listId, state),
    uncompletedIds: selectors.getUncompletedTodoIds(listId, state),
  };
};

const mapDispatchToProps = dispatch => ({
  onRemove: todo => dispatch(actionCreators.removeTodo(todo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodosContainer);
