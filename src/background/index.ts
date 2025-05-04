import { BackgroundContainerProvider } from './provider/background_container_provider';
import { MessageListener } from './services/message_listener';
import { GestureActionHandler } from './services/gesture_action_handler';
import { DragActionHandler } from './services/drag_action_handler';

const containerProvider = new BackgroundContainerProvider();
const container = containerProvider.getContainer();

const gestureActionHandler = container.get(GestureActionHandler);
const dragActionHandler = container.get(DragActionHandler);
const messageListener = new MessageListener(gestureActionHandler, dragActionHandler);

messageListener.listen();
