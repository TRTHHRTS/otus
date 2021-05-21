### Домашнее задание N4

docker build . -t trthhrts/simple_app:v9
docker push trthhrts/simple_app:v9

helm install postgres bitnami/postgresql -f ./helm-pg/values.yaml

kubectl apply -f ./helm-pg/initdb.yaml

helm install trtapp ./trt-chart

minikube service trtapp-trt-chart --url

#### Удалить все
kubectl delete all --all
kubectl get pvc
kubectl delete pvc data-postgres-0 
kubectl get pv
kubectl delete pv ...