;; Simulation Management Contract

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_SIMULATION (err u101))
(define-constant ERR_INVALID_STATUS (err u102))

;; Data variables
(define-data-var simulation-count uint u0)

;; Data maps
(define-map simulations
  uint
  {
    creator: principal,
    name: (string-ascii 64),
    description: (string-utf8 256),
    parameters: (string-utf8 1024),
    status: (string-ascii 20),
    resource-allocation: uint,
    start-time: uint,
    end-time: uint
  }
)

;; Public functions
(define-public (create-simulation (name (string-ascii 64)) (description (string-utf8 256)) (parameters (string-utf8 1024)))
  (let
    (
      (simulation-id (+ (var-get simulation-count) u1))
    )
    (map-set simulations
      simulation-id
      {
        creator: tx-sender,
        name: name,
        description: description,
        parameters: parameters,
        status: "pending",
        resource-allocation: u0,
        start-time: u0,
        end-time: u0
      }
    )
    (var-set simulation-count simulation-id)
    (ok simulation-id)
  )
)

(define-public (update-simulation-status (simulation-id uint) (new-status (string-ascii 20)))
  (let
    (
      (simulation (unwrap! (map-get? simulations simulation-id) ERR_INVALID_SIMULATION))
    )
    (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (is-eq tx-sender (get creator simulation))) ERR_NOT_AUTHORIZED)
    (asserts! (or (is-eq new-status "pending") (is-eq new-status "running") (is-eq new-status "completed") (is-eq new-status "failed")) ERR_INVALID_STATUS)
    (ok (map-set simulations
      simulation-id
      (merge simulation {
        status: new-status,
        start-time: (if (is-eq new-status "running") block-height u0),
        end-time: (if (or (is-eq new-status "completed") (is-eq new-status "failed")) block-height u0)
      })
    ))
  )
)

(define-public (allocate-resources (simulation-id uint) (resources uint))
  (let
    (
      (simulation (unwrap! (map-get? simulations simulation-id) ERR_INVALID_SIMULATION))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set simulations
      simulation-id
      (merge simulation { resource-allocation: resources })
    ))
  )
)

;; Read-only functions
(define-read-only (get-simulation (simulation-id uint))
  (map-get? simulations simulation-id)
)

(define-read-only (get-simulation-count)
  (var-get simulation-count)
)

