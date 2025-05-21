import { Container } from 'inversify';

export interface IContainerProvider {
    getContainer(): Container;
} 