import producerListItemTpl from 'scripts/liveblog-syndication/views/producer-list-item.html';

producerList.$inject = ['api', '$http', 'modal', 'config'];

export default function producerList(api, $http, modal, config) {
    return {
        templateUrl: producerListItemTpl,
        scope: {
            roles: '=',
            producers: '=',
            selected: '=',
            done: '='
        },
        link: function(scope, elem, attrs) {
            scope.select = function(producer) {
                scope.selected = producer;
            };

            scope.disable = function(e, producerToRemove) {
                e.stopPropagation();

                modal.confirm(gettext('Are you sure you want to remove this consumer?'))
                    .then(() => api.producers.remove(producerToRemove))
                    .then((result) => {
                        angular.forEach(scope.producers, (producer, i) => {
                            if (producer._id === producerToRemove._id) {
                                scope.producers.splice(i, 1);
                            }
                        });
                    });
            };

            scope.checkOnlineStatus = function(e, producer) {
                e.stopPropagation();

                $http({
                    url: `${config.server.url}/producers/${producer._id}/check_connection`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                })
                    .then((result) => {
                        console.log(result);
                    });
            };
        }
    };
}
